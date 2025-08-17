// app/components/sections/profile.tsx

// La palabra 'export' aquí es la clave para que puedas importar este componente
export function Profile() {
  return (
    <div className="text-white bg-[#20333b] p-6 rounded-lg shadow-lg animate-fade-in">
      <h1 className="text-2xl font-bold text-[#29c2a3] mb-4 border-b border-gray-700 pb-2">
        Mi Perfil
      </h1>
      <div className="mt-4 space-y-3">
        <div className="flex items-center">
          <strong className="w-24">Nombre:</strong>
          <span>Julio Contreras</span>
        </div>
        <div className="flex items-center">
          <strong className="w-24">Email:</strong>
          <span>julio.contreras@email.com</span>
        </div>
        <p className="mt-6 pt-4 text-sm text-gray-400 border-t border-gray-700">
          Aquí puedes añadir más detalles y opciones para que el usuario gestione su perfil.
        </p>
      </div>
    </div>
  );
}

// Es una buena práctica exportar el componente por defecto también
export default Profile;
