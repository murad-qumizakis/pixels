import React from "react";
import prisma from "../../server/db/client";
import Pixels from "../../components/Pixels";
import Image from "next/image";

export default function Art({ artObj, userObj }) {
  console.log("artObj", artObj);
  console.log("userObj", userObj);

  return (
    <>
      <div className="flex flex-col m-auto w-96 my-10">
        <Image
          alt="Profile photo of the user who posted the art below"
          src={userObj.image}
          width={100}
          height={100}
        ></Image>
        <h1>{userObj.name}</h1>
        <h2>{userObj.email}</h2>
      </div>
      <div className="flex flex-col m-auto w-96 my-10">
        <Pixels pixelColors={artObj.pixels}></Pixels>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let art = await prisma.pixelArt.findUnique({
    where: {
      id: +context.params.artId,
    },
  });
  let user = await prisma.user.findUnique({
    where: {
      id: art.userId,
    },
  });

  let userObj = JSON.parse(JSON.stringify(user));
  let artObj = JSON.parse(JSON.stringify(art));
  return {
    props: {
      artObj,
      userObj,
    },
  };
}
