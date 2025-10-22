const Partenaires = () => {
  return (
    <section id="partenaires" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Nos Partenaires Internationaux</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nous collaborons avec des réseaux et communautés à travers le monde pour amplifier notre impact 
            et partager les meilleures pratiques en matière d'économie collaborative
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Réseau Transition', 'Platform Coops', 'Economy for the Common Good', 'Social Innovation Lab'].map((partner) => (
              <div key={partner} className="px-6 py-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl text-gray-700 font-medium border border-gray-200">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partenaires;
