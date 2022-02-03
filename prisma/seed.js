const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log(`start seeding ...`);

  const projectData = await prisma.project.createMany({
    data: [
      {
        name: "Wild Pod School",
        year: 2021,
        details: "Site parodique de Star Wars",
        image: {
          principal: "/images/wild1.png",
          secondary: [
            "/images/wild2.png",
            "/images/wild3.png",
            "/images/wild4.png",
          ],
        },
        link: "https://wild-pod-school.vercel.app/",
      },
    ],
  });

  const competenceData = await prisma.competence.createMany({
    data: [
      {
        technologie: "react",
        skills: "Gestion des composants/ appel API/ Lien entre Node et React",
      },
      {
        technologie: "node",
        skills: "Prisma/ gestion d'erreur/ Lien entre React et Node",
      },
    ],
  });

  console.log({
    projectData,
  });

  console.log(`🎉 🎉  Seeding is finish! 🎉 🎉 `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
