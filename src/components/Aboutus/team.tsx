'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

// import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
  credentials: string[] | string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch('/api/team');
        if (!res.ok) throw new Error("Failed to fetch team members");
        const data = await res.json();

        const updatedTeamMembers = await Promise.all(data.map(async (member: TeamMember) => {
          if (member.imageUrl) {
            const imageRes = await fetch(member.imageUrl);
            const imageBlob = await imageRes.blob();
            member.imageUrl = URL.createObjectURL(imageBlob);
          }

          if (typeof member.credentials === 'string') {
            member.credentials = member.credentials.split(',').map((item: string) => item.trim());
          }

          return member;
        }));

        setTeamMembers(updatedTeamMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);


  const renderRow = (startIndex: number, endIndex: number) => {
    return (
      <div className="hidden sm:flex justify-center gap-12">
        {teamMembers.slice(startIndex, endIndex).map((member) => (
          <div key={member.id} className="group h-[350px] w-[260px] [perspective:1000px]">
            <div className="relative h-full w-full shadow-xl transition-all duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
                <div className="h-3/4 relative">
                  {member.imageUrl ? (
                    <Image
                      className="object-cover object-center h-full w-full"
                      src={member.imageUrl}
                      alt={member.name}
                      layout="fill"
                    />
                  ) : (
                    <div className="bg-gray-200 h-full w-full">Image not available</div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center h-1/4 bg-white">
                  <p className="text-lg text-blue-950 font-bold">{member.name}</p>
                  <p className="text-base">{member.title}</p>
                </div>
              </div>
              <div className="absolute inset-0 h-full w-full bg-white/80 px-1 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div className="flex min-h-full flex-col items-justify justify-start text-left pt-6 mx-5">
                  <p className="text-lg text-blue-950 font-bold">{member.name}</p>
                  <h2 className="text-lg text-black font-bold mb-4 uppercase">Credentials</h2>
                  <ul className="list-none list-inside text-sm text-black">
                    {Array.isArray(member.credentials) && member.credentials.length > 0 ? (
                      member.credentials.map((credential, index) => (
                        <li key={index} className="mb-1">{credential}</li>
                      ))
                    ) : (
                      <li>No credentials available</li>
                    )}
                  </ul>
                  {/* <div className="flex justify-center mt-auto mb-4">
                    <Link
                      href={`/about-us/credential/${member.id}`}
                      className="text-blue-950 hover:text-blue-700 text-sm font-semibold"
                    >
                      View More
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 mx-auto sm:py-20">
      <div className="mx-auto flex justify-center px-4 sm:px-6 lg:max-w-7xl">
        <div className="flex flex-col gap-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#004f83]">Meet Our Team</h2>
          {renderRow(0, 2)}
          {renderRow(2, 6)}
          {renderRow(6, 8)}
          {renderRow(8, teamMembers.length)}

          <div className="grid grid-cols-2 sm:hidden gap-4">
            {loading ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="w-[300px] space-y-5 p-4" radius="lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300" />
                    </Skeleton>
                    <div className="space-y-3">
                      <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-8 w-3/5 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="w-5/5 rounded-lg">
                        <div className="h-8 w-4/5 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-8 w-2/5 rounded-lg bg-default-300" />
                      </Skeleton>
                    </div>
                  </Card>
                ))}
              </>
            ) : (
              teamMembers.map((member) => (
                <div key={member.id} className="group h-[280px] w-[140px] mx-auto">
                  <div className="relative h-full w-full shadow-lg transition-all duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 h-full w-full [backface-visibility:hidden]">
                      <div className="h-2/3 relative">
                        {member.imageUrl ? (
                          <Image
                            className="object-cover object-center h-full w-full"
                            src={member.imageUrl}
                            alt={member.name}
                            layout="fill"
                          />
                        ) : (
                          <div className="bg-gray-200 h-full w-full text-center flex items-center justify-center">
                            <p className="text-xs text-gray-500">Image not available</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center h-1/3 bg-white px-2">
                        <p className="text-xs text-blue-950 font-bold text-center break-words">{member.name}</p>
                        <p className="text-[10px] text-gray-700 text-center">{member.title}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 h-full w-full bg-white/80 px-2 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      <div className="flex min-h-full flex-col items-justify justify-start text-left pt-3 mx-2">
                        <p className="text-xs text-blue-950 font-bold">{member.name}</p>
                        <h2 className="text-sm text-black font-bold mb-2 uppercase">Credentials</h2>
                        <ul className="list-none list-inside text-[10px] text-black text-justify">
                          {Array.isArray(member.credentials) && member.credentials.length > 0 ? (
                            member.credentials.map((credential, index) => (
                              <li key={index} className="mb-1">{credential}</li>
                            ))
                          ) : (
                            <li>No credentials available</li>
                          )}
                        </ul>
                        {/* <div className="flex justify-center mt-auto mb-3">
                        <Link
                          href={`/about-us/credential/${member.id}`}
                          className="text-blue-950 hover:text-blue-700 text-[10px] font-semibold"
                        >
                          View More
                        </Link>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>


        </div>
      </div>
    </section>
  );
};

export default Team;
