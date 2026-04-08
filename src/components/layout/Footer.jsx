export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white transition">Productos</a></li>
              <li><a href="/cart" className="hover:text-white transition">Carrito</a></li>
              <li><a href="/orders" className="hover:text-white transition">Mis órdenes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>contacto@mitienda.com</li>
              <li>+54 11 1234-5678</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Redes sociales</h4>
            <ul className="space-y-2 text-sm">
              <li>@mitiendaElectro</li>
              <li>+54 11 1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Mi Tienda. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}