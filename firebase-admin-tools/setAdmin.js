// setAdmin.js
const admin = require("firebase-admin");

// ✅ pon aquí el nombre real del json descargado
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminByEmail(email) {
  // 1) obtener usuario por email
  const user = await admin.auth().getUserByEmail(email);

  // 2) setear custom claims
  await admin.auth().setCustomUserClaims(user.uid, {
    roles: ["ADMIN"],
  });

  console.log(`✅ Listo: ${email} ahora tiene roles: ["ADMIN"]`);
  console.log(`UID: ${user.uid}`);
}

setAdminByEmail("admin@tiendacats.com")
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });
