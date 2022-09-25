const Realm = require("realm");

const LeituraSchema = {
    name: "Leitura",
    properties: {
      _id: "int",
      temperatura: "float",
    },
    primaryKey: "_id",
  };

  async function quickStart() {
    const realm = await Realm.open({
      path: "myrealm",
      schema: [LeituraSchema],
    });
    
    let leitura1, leitura2;
    realm.write(() => {
        leitura1 = realm.create("Leitura", {
            _id: 1,
            temperatura: 10.2,
        });
        leitura2 = realm.create("Leitura", {
            _id: 2,
            name: 10.3,
        });
        console.log(`created two tasks`);
    });
}
quickStart();

