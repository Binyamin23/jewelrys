const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://benybar:Nnimaynib21@cluster0.mykqfum.mongodb.net/jewelrysShop');
  console.log("mongo atlas connect")
}

