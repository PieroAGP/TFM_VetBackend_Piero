const createUser = async () => {
  const userData = {
    nombre: "Piero",
    email: "piero@gmail.com",
    rol: "absoluteAdmin",
    password: "piero1234",
    edad: 24,
    ubicacion: "Madrid"
  };

  try {
    console.log('Datos a enviar:', userData);

    const response = await fetch('http://localhost:4000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Respuesta del servidor con error:', data);
      throw new Error(data.error || 'Error al crear el usuario');
    }

    console.log('Usuario creado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error al crear el usuario:', error.message);
    throw error;
  }
};

createUser();
