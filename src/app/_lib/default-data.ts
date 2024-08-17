export const DEFAULT_DATA: any[] = [
    {
      table: "Famille",
      values: [
        { nom: 'Autres', description: 'Description de la famille D', user_id: 1, deletedAt: 0 },
        { nom: 'Kadji', description: 'Description de la famille A', user_id: 1, deletedAt: 0 },
        { nom: 'SABC', description: 'Description de la famille B', user_id: 1, deletedAt: 0 },
        { nom: 'Guinness', description: 'Description de la famille C', user_id: 1, deletedAt: 0 },
      ]
    },
    {
      table: 'PointVente',
      values: [
          { nom: 'Principale', description: 'Le point de vente principale', adresse: 'Rue de la Poste, Yaoundé', user_id: 1, deletedAt: 0 },
      ]
    },
    {
      table: 'Fournisseur',
      values: [
          { nom: 'Rene Tkc', adresse: 'Quartier des Affaires, Bafoussam', phone1: '+237 6 88 44 55 66', photo: '', collecte_ristourne: false, user_id: 1, deletedAt: 0 },
          { nom: 'SABC', adresse: 'Avenue des Entrepreneurs, Yaoundé', phone1: '+237 6 55 11 22 33', photo: '', collecte_ristourne: true, user_id: 1, deletedAt: 0 },
          { nom: 'Kadji', adresse: 'Boulevard de la Liberté, Douala', phone1: '+237 6 66 22 33 44', photo: '', collecte_ristourne: true, user_id: 1, deletedAt: 0 },
          { nom: 'Guinness Cameroun', adresse: 'Route de l’Aéroport, Garoua', phone1: '+237 6 77 33 44 55', photo: '', collecte_ristourne: true, user_id: 1, deletedAt: 0 },
      ]
    },
    {
        table: 'Employe',
        values: [
            { nom: 'Njoya Paul', adresse: 'Rue de la Liberté, Yaoundé', phone1: '+237 6 55 11 22 33', cni: '123456789', photo: '[]', user_id: 1, deletedAt: 0 },
            { nom: 'Mbah Marie', adresse: 'Avenue des Palmiers, Douala', phone1: '+237 6 66 22 33 44', cni: '987654321', photo: '[]', user_id: 1, deletedAt: 0 },
          ]
    },
    {
        table: 'Categorie',
        values: [
          { nom: 'Champagnes', description: 'Catégorie pour les Champagnes', type: 'produit', user_id: 1, deletedAt: 0 },
          { nom: 'Vins et spiritueux', description: 'Catégorie pour les vins, spiritueux et autres boissons alcoolisées', type: 'produit', user_id: 1, deletedAt: 0 },
          { nom: 'Eaux minérales', description: 'Catégorie pour les différentes marques d’eau minérale', type: 'produit', user_id: 1, deletedAt: 0 },
          { nom: 'Jus', description: 'Catégorie pour les boissons non alcoolisées et gazeuses', type: 'produit', user_id: 1, deletedAt: 0 },
          { nom: 'Bières', description: 'Catégorie pour les différentes marques de bières', type: 'produit', user_id: 1, deletedAt: 0 },
          { nom: 'Entretien et réparations', description: 'Catégorie pour les dépenses d’entretien et de réparations', type: 'depense', user_id: 1, deletedAt: 0 },
          { nom: 'Loyer', description: 'Catégorie pour les dépenses liées aux loyers ou aux locations.', type: 'depense', user_id: 1, deletedAt: 0 },
          { nom: 'Factures(eau, lumière, etc)', description: 'Catégorie pour les dépenses liées aux services publics (eau, électricité, etc).', type: 'depense', user_id: 1, deletedAt: 0 },
          { nom: 'Frais Administratif (impôts)', description: 'Catégorie pour les dépenses liées aux impots', type: 'depense', user_id: 1, deletedAt: 0 },
          { nom: 'Équipements', description: 'Catégorie pour l’achat d’équipements et de matériels', type: 'depense', user_id: 1, deletedAt: 0 },
          { nom: 'Salaires', description: 'Catégorie pour les dépenses liées aux salaires des employés', type: 'depense', user_id: 1, deletedAt: 0 },
          ]
    },
    {
        table: 'Casier',
        values: [
             { nbre_btle_par_casier: 6, nom: 'C6', description: 'Un casier contenant 6 bouteilles', user_id: 1, deletedAt: 0 },
             { nbre_btle_par_casier: 24, nom: 'C24', description: 'Un casier contenant 24 bouteilles', user_id: 1, deletedAt: 0 },
             { nbre_btle_par_casier: 15, nom: 'C15', description: 'Un casier contenant 15 bouteilles', user_id: 1, deletedAt: 0 },
             { nbre_btle_par_casier: 12, nom: 'C12', description: 'Un casier contenant 12 bouteilles', user_id: 1, deletedAt: 0 },
          ]
    },
    {
      table: 'Produit',
      values: [
        { nom: '33 Export', qte: 0, prixA: 7200, prixV: 7800, nbreBtleParCasier: 12, ristourne: 250, 
            id_categorie: 5, id_casier: 4, id_famille: 3, 
            fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
             upload: '', imgLink: 'preconfig-33-export.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Castel Beer', qte: 0, prixA: 7200, prixV: 7800, nbreBtleParCasier: 12, ristourne: 250,
             id_categorie: 5, id_casier: 4, id_famille: 3, 
             fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-castel-beer.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Mützig', qte: 0, prixA: 7200, prixV: 7800, nbreBtleParCasier: 12, ristourne: 250,
             id_categorie: 5, id_casier: 4, id_famille: 3, 
             fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-mutzig.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Beaufort Ordinaire', qte: 0, prixA: 7200, prixV: 7800, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 5, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-beaufort-ordinaire.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Beaufort Light', qte: 0, prixA: 7200, prixV: 7800, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 5, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-beaufort-light.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Isenbeck Premium', qte: 0, prixA: 8400, prixV: 9000, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 5, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-isembeck.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Manyan', qte: 0, prixA: 6000, prixV: 6600, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 5, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-manyan.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Djino Cocktail', qte: 0, prixA: 5100, prixV: 6000, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 4, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-djino-cocktail.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Djino Pamplemousse', qte: 0, prixA: 5100, prixV: 6000, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 4, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-djino-pamplemousse.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Top Orange', qte: 0, prixA: 5100, prixV: 6000, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 4, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-top-orange.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Top Ananas', qte: 0, prixA: 5100, prixV: 6000, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 4, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-top-orange.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Top Pamplemousse', qte: 0, prixA: 5100, prixV: 6000, nbreBtleParCasier: 12, ristourne: 250,
          id_categorie: 4, id_casier: 4, id_famille: 3, 
          fournisseurs: '[{\"id\":3,\"nom\":\"SABC\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
           upload: '', imgLink: 'preconfig-top-pamplemousse.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Kadji Beer', qte: 0, prixA: 7200, prixV: 7800, nbreBtleParCasier: 12, ristourne: 250,
             id_categorie: 5, id_casier: 4, id_famille: 4, 
             fournisseurs: '[{\"id\":4,\"nom\":\"Kadji\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-kadji.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'K44', qte: 0, prixA: 6000, prixV: 6600, nbreBtleParCasier: 12, ristourne: 250,
             id_categorie: 5, id_casier: 4, id_famille: 4, 
             fournisseurs: '[{\"id\":4,\"nom\":\"Kadji\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-k44.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Spécial Pamplemousse', qte: 0, prixA: 5100, prixV: 6000, nbreBtleParCasier: 12, ristourne: 250,
             id_categorie: 4, id_casier: 4, id_famille: 4, 
             fournisseurs: '[{\"id\":4,\"nom\":\"Kadji\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-top-pamplemousse.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Petite Guinness', qte: 0, prixA: 14400, prixV: 15600, nbreBtleParCasier: 24, ristourne: 300,
             id_categorie: 5, id_casier: 2, id_famille: 2, 
             fournisseurs: '[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-petite-guinness.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Grande Guinness', qte: 0, prixA: 11400, prixV: 13200, nbreBtleParCasier: 12, ristourne: 300,
             id_categorie: 5, id_casier: 4, id_famille: 2, 
             fournisseurs: '[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-grande-guinness.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Guinness Smooth', qte: 0, prixA: 10500, prixV: 11250, nbreBtleParCasier: 15, ristourne: 300,
             id_categorie: 5, id_casier: 3, id_famille: 2, 
             fournisseurs: '[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-guinness-smooth.jpeg', hasCasier: true, user_id: 1, deletedAt: 0 
        },
        { nom: 'Black & White', qte: 0, prixA: 48000, prixV: 60000, nbreBtleParCasier: 6, ristourne: 0,
             id_categorie: 2, id_casier: 1, id_famille: 2, 
             fournisseurs: '[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]',
              upload: '', imgLink: 'preconfig-whisky-black.jpeg', hasCasier: false, user_id: 1, deletedAt: 0 
        }
      ]
    }
  ];