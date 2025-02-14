const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			id : null,
			users: [],
			user: null,
			auth: localStorage.getItem('token') || false,

		},
		actions: {

			// --------------------Data--------------------

			
			getUserData: async () =>{try{

				const resp = await fetch(process.env.BACKEND_URL + 'protected', {
					method: 'GET',
					headers: {
						'Content-Type' : 'application/json',
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					},
					body: JSON.stringify(formData)
				})
				if(!resp.ok) throw new Error('Error datos')
				const data = await resp.json()
				console.log(data)
				localStorage.setItem('token', data.token)
				setStore({user: data.user})
			}
			catch (error){
				console.error(error)
			}
		},

		
		
		// --------------------Formularies--------------------


		register: async (formData) => {
			try {
				const resp = await fetch(process.env.BACKEND_URL + 'api/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						// Elimina el header Authorization
					},
					body: JSON.stringify(formData)
				})
				if (!resp.ok) throw new Error('Error registering')
				const data = await resp.json()
				console.log(data)
				localStorage.setItem('token', data.token)
				localStorage.setItem('id', data.id)
				setStore({ auth: true, token: data.token, id: data.user.id })
				return true;
			}
			catch (error) {
				console.error(error)
				return false;
			}
		},
		login: async (formData) => {

			try{
				const response = await fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Credenciales incorrectas");
				}

				const data = await response.json();

				localStorage.setItem("token", data.token);
				localStorage.setItem("id", data.user.id);
				setStore({ auth: true, token: data.token , id: data.user.id});

				return true; 
			}
			catch (error){
				console.error(error)
				return false;
			}
		},

		// --------------------Users--------------------


		getUsers: async () => {
			try {
				const response = await fetch(process.env.BACKEND_URL + '/api/users')
				if (!response.ok) throw new Error("Error obteniendo usuarios");
				const data = await response.json();
				setStore({ users: data.data });
			} catch (error) {
				console.error("Error obteniendo usuarios:", error);
			}
		},

		getUserId: async (id) => {
			try {
				const response = await fetch(process.env.BACKEND_URL + '/api/user/' + id)
				if (!response.ok) throw new Error("Error obteniendo el id del Usuario");
				const data = await response.json();
				return data.user;
			} catch (error) {
				console.error("Error obteniendo el ID del usuario:", error);
			}
		},
		}
	};
};

export default getState;
