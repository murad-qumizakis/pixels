import axios from "axios";
import { unstable_getServerSession } from "next-auth/next";
import { prisma } from "../../server/db/client";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  const session = await unstable_getServerSession(req, res, authOptions);
  const sessionUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  switch (method) {
    case "POST":
      const { pixelColors } = req.body;
      console.log("pixelColors", JSON.stringify(pixelColors));
      const newDrawing = await prisma.PixelArt.create({
        data: {
          pixels: pixelColors,
          userId: sessionUser.id,
        },
      });
      res.status(201).json({ newDrawing });
      break;

    case "GET":
      break;

    default:
      res.setHeader("Allow", ["POST", "GET", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
