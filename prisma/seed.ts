import { PrismaClient, Role, ApprovalStatus } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@skillclass.local" },
    update: {},
    create: {
      name: "SkillClass Owner",
      email: "admin@skillclass.local",
      passwordHash: hashPassword("ChangeMe123!"),
      role: Role.ADMIN
    }
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@skillclass.local" },
    update: {},
    create: {
      name: "Demo Teacher",
      email: "teacher@skillclass.local",
      passwordHash: hashPassword("ChangeMe123!"),
      role: Role.TEACHER,
      teacherProfile: { create: { qualification: "M.A.", expertise: "Mathematics" } },
      wallet: { create: {} }
    }
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@skillclass.local" },
    update: {},
    create: {
      name: "Demo Seller",
      email: "seller@skillclass.local",
      passwordHash: hashPassword("ChangeMe123!"),
      role: Role.SELLER,
      sellerProfile: { create: { bio: "Digital study resources seller" } },
      wallet: { create: {} }
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@skillclass.local" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@skillclass.local",
      passwordHash: hashPassword("ChangeMe123!"),
      role: Role.STUDENT
    }
  });

  const category = await prisma.category.upsert({
    where: { name: "Competitive Exams" },
    update: {},
    create: { name: "Competitive Exams" }
  });

  const course = await prisma.course.upsert({
    where: { slug: "demo-ssc-maths-live-batch" },
    update: {},
    create: {
      teacherId: teacher.id,
      categoryId: category.id,
      title: "SSC Maths Live Batch",
      slug: "demo-ssc-maths-live-batch",
      description: "A professional demo live-learning batch for SSC mathematics.",
      monthlyFee: 499,
      startTime: "19:00",
      endTime: "20:00",
      schedule: "Monday - Saturday",
      approvalStatus: ApprovalStatus.APPROVED
    }
  });

  await prisma.pdfBook.upsert({
    where: { slug: "demo-ssc-maths-notes" },
    update: {},
    create: {
      sellerId: seller.id,
      categoryId: category.id,
      title: "SSC Maths Complete Notes",
      slug: "demo-ssc-maths-notes",
      description: "Demo digital PDF listing. Replace storageKey with a real private storage object in production.",
      storageKey: "demo/ssc-maths-notes.pdf",
      price: 99,
      author: "SkillClass Demo",
      language: "Hindi",
      approvalStatus: ApprovalStatus.APPROVED
    }
  });

  console.log({ admin: admin.email, teacher: teacher.email, seller: seller.email, student: student.email, course: course.title });
}

main().finally(() => prisma.$disconnect());
