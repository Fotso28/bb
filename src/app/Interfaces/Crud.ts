export interface ICrud<T> {
    // Crée un nouvel objet
    create(item: T): Promise<boolean>;
  
    // Lit un objet par son identifiant
    read(id: number): Promise<boolean>;
  
    // Met à jour un objet
    update(item: T): Promise<boolean>;
  
    // Supprime un objet par son identifiant
    delete(item: T): Promise<boolean>;
  
    // Récupère tous les objets
    getAll(): Promise<boolean>;
  }