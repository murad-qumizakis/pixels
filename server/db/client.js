import { PrismaClient } from "@prisma/client";

export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;

// the one on the bottonm was giving me error: FATAL too many clients.. or smth like that

// import { PrismaClient } from '@prisma/client'

// export const prisma =
//   global.prisma ||
//   new PrismaClient({
//     log: ['query'],
//   })

// if (process.env.NODE_ENV !== 'production') global.prisrma = prisma
