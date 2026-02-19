const formRegister = document.getElementById("form-register");

if (formRegister) {

    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();

        const csrf = document.querySelector('meta[name="csrf-token"]').content;

        const data = {
            nombre: formRegister.nombre.value,
            apellidos: formRegister.apellidos.value,
            fecha_nacimiento: formRegister.fecha_nacimiento.value,
            peso_base: formRegister.peso_base.value,
            altura_base: formRegister.altura_base.value,
            email: formRegister.email.value,
            password: formRegister.password.value,
            password_confirmation: formRegister.password_confirmation.value
        };

        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRF-TOKEN": csrf
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        // 🔥 AQUÍ ESTÁ LA MAGIA
        document.getElementById("vista-login").classList.add("hidden");
        document.getElementById("vista-dashboard").classList.remove("hidden");

    });
}
