export const validateLogin = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.username) {
    errors.username = "El usuario es obligatorio.";
  }
  
  if (!data.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (data.password.length < 6) {
    errors.password = "Contraseña muy corta.";
  }

  return errors;
};

export const validateRegister = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name) {
    errors.name = "El nombre es obligatorio.";
  }

  if (!data.username) {
    errors.username = "El usuario es obligatorio.";
  }

  if (!data.email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "El correo electrónico no es válido.";
  }

  if (!data.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (data.password.length < 6) {
    errors.password = "Contraseña muy corta.";
  }

  return errors;
};

export const validateUpdateUser = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  const keys = Object.keys(data);
  if (keys.length === 0) {
    errors.general = "Debe proporcionar al menos un campo para actualizar.";
  }

  if (data.name !== undefined && data.name.length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  }

  if (data.username !== undefined && data.username.length < 3) {
    errors.username = "El nombre de usuario debe tener al menos 3 caracteres.";
  }

  if (data.email !== undefined && !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "El formato del correo electrónico no es válido.";
  }

  if (data.password !== undefined && data.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres.";
  }

  return errors;
};

export const validateCategory = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data || Object.keys(data).length === 0) {
    errors.general = "El cuerpo de la petición no puede estar vacío.";
    return errors;
  }

  if (!data.name) {
    errors.name = "El nombre de la categoría es obligatorio.";
  } else if (data.name.length < 3) {
    errors.name = "El nombre de la categoría debe tener al menos 3 caracteres.";
  }

  return errors;
};