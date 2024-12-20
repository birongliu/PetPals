"use client";
import getPetById from "@/app/actions/getPetById";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

const pet = {
  id: 1,
  name: "Luna",
  type: "Dog",
  breed: "Labrador Retriever",
  age: 2,
  description:
    "Luna is a friendly and energetic Labrador Retriever who loves to play fetch and go for long walks. She's great with kids and other dogs, making her the perfect family companion.",
  image: "/hero/hero-picture.svg?height=400&width=600",
  location: "New York, NY",
  adoptionFee: "$250",
  traits: ["Friendly", "Energetic", "Good with kids", "Trained"],
  caretaker: {
    name: "Emily Johnson",
    image: "/placeholder.svg?height=40&width=40",
  },
};

interface Pet {
  animalId: string;
  name: string;
  breed: string;
  description: string;
  pictureThumbnailUrl: string;
  isAdoptionPending: boolean;
  size: string;
  health: {
    isCurrentVaccinations: boolean;
  };
}

export default function Page() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const resolve = () => {
      getPetById(`${id}`).then((data) => setPet(data));
    };
    resolve();
  }, [id]);
  const { user } = useUser();

  const handleFavorite = async () => {
    setIsFavorite(!isFavorite);
    if (!user) return;
    const response = await fetch('http://localhost:3001/api/users/addFavorite', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, petId: id }),
    })
    const data = await response.json();
    console.log(data)
  }
  

  return (
    <div className="container lg:mx-10 px-4 py-8">
      <Link href="/pets">
        <button className="mb-4 border p-2 rounded-xl hover:bg-light-mint">
          ⬅ Back to all pets
        </button>
      </Link>
      <div className="flex">
        {pet && (
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <Image
                  src={pet.pictureThumbnailUrl}
                  alt={`Photo of ${pet.name}`}
                  width={800}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
                <button
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full"
                  onClick={handleFavorite}
                >
                  <FaHeart className={`h-5 w-5 ${isFavorite ? "fill-current text-red-500" : "text-gray-600"}`}/>
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{pet.name}</h1>
                    <p className="text-gray-600">{pet.breed}</p>
                  </div>
                  {pet.isAdoptionPending && (
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                      Adoption Pending
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold mb-2">About</h2>
                    <p className="text-gray-600">{pet.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">
                        Size
                      </h3>
                      <p>{pet.size}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">
                        Vaccinations
                      </h3>
                      <p>
                        {pet.health && pet.health.isCurrentVaccinations
                          ? "Up to date"
                          : "Needed"}
                      </p>
                    </div>
                  </div>

                  {!pet.isAdoptionPending && (
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
                      Start Adoption Process
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
