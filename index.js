const mongoose = require("mongoose");
// Importer les modules nécessaires
require("dotenv").config();
const dbHost = process.env.DB_HOST;

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Définir le schéma de la personne
const personSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  age: { type: Number, min: 0 }, // Ajout d'une contrainte pour que l'âge soit positif
  favoriteFoods: { type: [String], default: [] }, // Définit une valeur par défaut pour le tableau
});

// Créer le modèle de la personne
const Person = mongoose.model("Person", personSchema);

// Créer et sauvegarder un enregistrement d'un modèle
const createAndSavePerson = async (done) => {
  try {
    const personne = new Person({
      nom: "Jean",
      age: 30,
      favoriteFoods: ["Pizza", "Pasta"],
    });
    const data = await personne.save();
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Créer de nombreux enregistrements avec model.create()
const createManyPeople = async (arrayOfPeople, done) => {
  try {
    const people = await Person.create(arrayOfPeople);
    done(null, people);
  } catch (err) {
    done(err);
  }
};

// Utiliser model.find() pour rechercher dans votre base de données
const findPeopleByName = async (personName, done) => {
  try {
    const people = await Person.find({ nom: personName });
    done(null, people);
  } catch (err) {
    done(err);
  }
};

// Utiliser model.findOne() pour renvoyer un seul document correspondant à votre base de données
const findOneByFood = async (food, done) => {
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    done(null, person);
  } catch (err) {
    done(err);
  }
};

// Utiliser model.findById() pour rechercher votre base de données par _id
const findPersonById = async (personId, done) => {
  try {
    const person = await Person.findById(personId);
    done(null, person);
  } catch (err) {
    done(err);
  }
};

// Exécuter des mises à jour classiques en exécutant Rechercher, Modifier, puis Enregistrer
const findEditThenSave = async (personId, done) => {
  try {
    const person = await Person.findById(personId);
    person.favoriteFoods.push("hamburger");
    const updatedPerson = await person.save();
    done(null, updatedPerson);
  } catch (err) {
    done(err);
  }
};

// Exécuter de nouvelles mises à jour sur un document à l'aide de model.findOneAndUpdate()
const findAndUpdate = async (personName, done) => {
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { nom: personName },
      { age: 20 },
      { new: true, runValidators: true } // runValidators pour s'assurer que les validations sont appliquées
    );
    done(null, updatedPerson);
  } catch (err) {
    done(err);
  }
};

// Supprimer un document à l'aide de model.findByIdAndDelete
const removeById = async (personId, done) => {
  try {
    const removedPerson = await Person.findByIdAndDelete(personId); // Utilisation de findByIdAndDelete
    done(null, removedPerson);
  } catch (err) {
    done(err);
  }
};

// Supprimer de nombreux documents avec model.deleteMany()
const removeManyPeople = async (done) => {
  try {
    const result = await Person.deleteMany({ nom: "Mary" });
    done(null, result);
  } catch (err) {
    done(err);
  }
};

// Aides à la recherche de chaîne pour affiner les résultats
const queryChain = async (done) => {
  try {
    const data = await Person.find({ favoriteFoods: "burritos" })
      .sort("nom")
      .limit(2)
      .select("-age");
    done(null, data);
  } catch (err) {
    done(err);
  }
};

// Exécuter les fonctions ci-dessus
createAndSavePerson((err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
    // Appeler la prochaine fonction
    createManyPeople(
      [
        { nom: "Alice", age: 25, favoriteFoods: ["Sushi", "Salad"] },
        { nom: "Bob", age: 35, favoriteFoods: ["Burger", "Ice cream"] },
      ],
      (err, people) => {
        if (err) {
          console.error(err);
        } else {
          console.log(people);
          // Appeler la prochaine fonction
          findPeopleByName("Alice", (err, people) => {
            if (err) {
              console.error(err);
            } else {
              console.log(people);
              // Appeler la prochaine fonction
              findOneByFood("Pizza", (err, person) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(person);
                  // Appeler la prochaine fonction
                  findPersonById(data._id, (err, person) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(person);
                      // Appeler la prochaine fonction
                      findEditThenSave(data._id, (err, updatedPerson) => {
                        if (err) {
                          console.error(err);
                        } else {
                          console.log(updatedPerson);
                          // Appeler la prochaine fonction
                          findAndUpdate("Bob", (err, updatedPerson) => {
                            if (err) {
                              console.error(err);
                            } else {
                              console.log(updatedPerson);
                              // Appeler la prochaine fonction
                              removeById(data._id, (err, removedPerson) => {
                                if (err) {
                                  console.error(err);
                                } else {
                                  console.log(removedPerson);
                                  // Appeler la prochaine fonction
                                  removeManyPeople((err, result) => {
                                    if (err) {
                                      console.error(err);
                                    } else {
                                      console.log(result);
                                      // Appeler la prochaine fonction
                                      queryChain((err, data) => {
                                        if (err) {
                                          console.error(err);
                                        } else {
                                          console.log(data);
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    );
  }
});

// Exporter les fonctions pour les tests

module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
};
