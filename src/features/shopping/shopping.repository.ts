import type { PurchaseEntity, PurchaseItemEntity } from './entities/shopping.entity.js';
import type { SupplierEntity } from '../supplier/entities/supplier.entity.js';
import type { ProductEntity } from '../products/entities/product.entity.js';
import type { IPurchaseRepository } from './interfaces/shopping.repository.interface.js';
import { pool } from '../../infra/database/mysql.config.js'; 

export class PurchaseRepository implements IPurchaseRepository {

  async create(purchase: PurchaseEntity): Promise<PurchaseEntity> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        'INSERT INTO purchases (id, supplier_id, invoice_number, created_at, active) VALUES (?, ?, ?, ?, ?)',
        [purchase.id, purchase.supplier.id, purchase.invoiceNumber, purchase.createdAt, purchase.active ? 1 : 0]
      );
      for (const item of purchase.items) {
        await connection.query(
          'INSERT INTO purchase_items (purchase_id, product_id, quantity) VALUES (?, ?, ?)',
          [purchase.id, item.product.id, item.quantity]
        );

        await connection.query(
          'UPDATE products SET in_stock = in_stock + ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }

      await connection.commit();
      return purchase;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findAll(): Promise<PurchaseEntity[]> {
    const [rows]: any = await pool.query(
      `SELECT p.*, s.name as supplier_name 
       FROM purchases p 
       JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.active = 1`
    );

    const purchases: PurchaseEntity[] = [];

    for (const row of rows) {
      const [itemRows]: any = await pool.query(
        `SELECT pi.quantity, pr.* 
         FROM purchase_items pi 
         JOIN products pr ON pi.product_id = pr.id 
         WHERE pi.purchase_id = ?`,
        [row.id]
      );

      const items: PurchaseItemEntity[] = itemRows.map((item: any) => ({
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          inStock: item.in_stock
        } as ProductEntity,
        quantity: item.quantity
      }));

      purchases.push({
        id: row.id,
        supplier: { id: row.supplier_id, name: row.supplier_name } as SupplierEntity,
        invoiceNumber: row.invoice_number,
        items: items,
        createdAt: row.created_at,
        active: row.active === 1
      });
    }

    return purchases;
  }

  async findById(id: string): Promise<PurchaseEntity | null> {
    const [rows]: any = await pool.query(
      `SELECT p.*, s.name as supplier_name 
       FROM purchases p 
       JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.id = ? AND p.active = 1`,
      [id]
    );

    if (rows.length === 0) return null;
    const row = rows[0];

    const [itemRows]: any = await pool.query(
      `SELECT pi.quantity, pr.* 
         FROM purchase_items pi 
         JOIN products pr ON pi.product_id = pr.id 
         WHERE pi.purchase_id = ?`,
      [row.id]
    );

    const items: PurchaseItemEntity[] = itemRows.map((item: any) => ({
      product: {
        id: item.id,
        name: item.name,
        price: item.price,
        inStock: item.in_stock
      } as ProductEntity,
      quantity: item.quantity
    }));

    return {
      id: row.id,
      supplier: { id: row.supplier_id, name: row.supplier_name } as SupplierEntity,
      invoiceNumber: row.invoice_number,
      items: items,
      createdAt: row.created_at,
      active: row.active === 1
    };
  }

  async updateInvoice(id: string, invoiceNumber: string): Promise<PurchaseEntity | null> {
    await pool.query('UPDATE purchases SET invoice_number = ? WHERE id = ?', [invoiceNumber, id]);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const purchase = await this.findById(id);
    if (!purchase) return false;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query('UPDATE purchases SET active = 0 WHERE id = ?', [id]);

      for (const item of purchase.items) {
        await connection.query(
          'UPDATE products SET in_stock = in_stock - ? WHERE id = ?',
          [item.quantity, item.product.id]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}