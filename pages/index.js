import Pixels from "../components/Pixels";
import PreviousMap from "postcss/lib/previous-map";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import axios from "axios";
import { prisma } from "./../server/db/client";
import Link from "next/link";

function createBlankArray(number = 16) {
  return Array(number)
    .fill(0)
    .map((a) => Array(number).fill(0));
}
// let as

export default function Home({ sesh, pixelArtObj }) {
  console.log("sesh", sesh);
  console.log("pixelArtObj", pixelArtObj);
  const [pixelColors, setPixelColors] = useState(createBlankArray(16));
  const [art, setArt] = useState(pixelArtObj);

  useEffect(() => {
    axios.get("/api/savePixels").then((res) => {
      setArt(res.data);
    });
  }, [art]);

  function handleSavePixels() {
    axios.post("/api/savePixels", {
      pixelColors,
    });
  }

  return (
    <>
      <div className="h-screen">
        {pixelArtObj.map((pixelArt) => {
          let url = `/singleArt/${pixelArt.id}`;
          return (
            <div key={pixelArt.id} className="flex flex-col m-auto w-96 my-10">
              <Link href={url}>
                <Pixels pixelColors={pixelArt.pixels}></Pixels>
              </Link>
            </div>
          );
        })}

        <div className="flex flex-col items-center justify-around h-1/6">
          <h2 className="text-center text-7xl">Create a new drawing</h2>
          <div className="flex">
            {sesh ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                onClick={async () => {
                  // save the matrix
                  // reset the matrix
                  let savedPixels = setPixelColors(createBlankArray(16));
                  handleSavePixels(savedPixels);
                }}
              >
                save
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
                onClick={() => signIn()}
              >
                Sign in to save
              </button>
            )}

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-5"
              onClick={() => {
                // console.log("yo");
                setPixelColors(createBlankArray(16));
              }}
            >
              reset
            </button>
          </div>
        </div>

        <div className="flex flex-col max-h-screen items-center h-5/6">
          <Pixels
            pixelColors={pixelColors}
            onPixelClick={(rowIndex, colIndex) => {
              console.log(rowIndex, colIndex);
              const newPixelColors = [...pixelColors];
              newPixelColors[rowIndex][colIndex] =
                newPixelColors[rowIndex][colIndex] === 1 ? 0 : 1;
              setPixelColors(newPixelColors);
            }}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const sesh = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const pixelArt = await prisma.pixelArt.findMany();
  let pixelArtObj = JSON.parse(JSON.stringify(pixelArt));
  return {
    props: {
      sesh,
      pixelArtObj,
    },
  };
}
