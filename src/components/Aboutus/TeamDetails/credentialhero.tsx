import React, { useEffect, useState } from 'react';
import { MdOutlineContactPhone } from "react-icons/md";
import MemberImageSlider from './memberslider';

interface TeamMember {
  name: string;
  title: string;
}

interface TeamMemberDetail {
  officeAddress: string;
  mobileNumber: string;
  telephoneNumber: string;
  websiteLink: string;
  email: string;
  workAddress: Address;
}

interface Address {
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

interface HeroSectionProps {
  teamMemberId: number;
}

function HeroSection({ teamMemberId }: HeroSectionProps) {
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [teamMemberDetail, setTeamMemberDetail] = useState<TeamMemberDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamMemberId) {
      setError('No team member ID provided.');
      return;
    }

    const fetchTeamMemberData = async () => {
      try {
        const response = await fetch(`/api/team_details?id=${teamMemberId}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setTeamMember({
            name: data.teamMember.name,
            title: data.teamMember.title,
          });

          setTeamMemberDetail({
            officeAddress: data.officeAddress,
            mobileNumber: data.mobileNumber,
            telephoneNumber: data.telephoneNumber,
            websiteLink: data.websiteLink,
            email: data.email,
            workAddress: {
              streetAddress: data.officeAddress.streetAddress,
              city: data.officeAddress.city,
              postalCode: data.officeAddress.postalCode,
              country: data.officeAddress.country,
            },
          });
        }
      } catch {
        setError('Failed to fetch team member data');
      }
    };

    fetchTeamMemberData();
  }, [teamMemberId]);

  
  if (error) return <p>{error}</p>;

  const generateVCard = () => {
    if (!teamMember || !teamMemberDetail) {
      return '';
    }

    return `BEGIN:VCARD
    VERSION:3.0
    FN:${teamMember.name}
    TITLE:${teamMember.title}
    TEL;HOME:${teamMemberDetail.mobileNumber} 
    TEL;WORK:${teamMemberDetail.telephoneNumber} 
    EMAIL:${teamMemberDetail.email}  
    URL;WORK:${teamMemberDetail.websiteLink}
    ORG:Infinitech Advertising Corporation
    END:VCARD`;
  };

  const downloadVCard = () => {
    const vCard = generateVCard();

    if (!vCard) {
      return;
    }

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamMember?.name || 'team-member'}-contact.vcf`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fallbackData = (
    <div className="text-white">
      <h2 className="text-3xl md:text-5xl font-bold uppercase">No Data Available</h2>
      <p className="text-lg md:text-xl">No team member information has been inserted yet.</p>
    </div>
  );

  return (
    <div className="relative flex flex-col-reverse lg:flex-row h-auto lg:h-[70vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('/img/hero-background.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#06264d] to-[#1f62b3] opacity-90"></div>

      <div className="relative z-10 flex flex-col items-start justify-center px-4 lg:ml-60 py-6 lg:px-12 text-left max-w-full lg:max-w-lg">
        {teamMember && teamMemberDetail ? (
          <div className="text-white mb-6">
            <h2 className="text-3xl md:text-5xl font-bold uppercase mt-16 lg:mt-0">
              {teamMember.name}
            </h2>
            <p className="text-xl md:text-2xl font-bold text-white mb-6">{teamMember.title}</p>
            <p className="text-sm md:text-base mb-2"><strong>Office Address:</strong> {teamMemberDetail.officeAddress}</p>
            <p className="text-sm md:text-base mb-2"><strong>Mobile:</strong> <a href={`tel:${teamMemberDetail.mobileNumber}`} className="text-white hover:underline">{teamMemberDetail.mobileNumber}</a></p>
            <p className="text-sm md:text-base mb-2"><strong>Telephone:</strong> <a href={`tel:${teamMemberDetail.telephoneNumber}`} className="text-white hover:underline">{teamMemberDetail.telephoneNumber}</a></p>
            <p className="text-sm md:text-base mb-2"><strong>Email:</strong> <a href={`mailto:${teamMemberDetail.email}`} className="text-white hover:underline">{teamMemberDetail.email}</a></p>
            <p className="text-sm md:text-base mb-4"><strong>Website:</strong> <a href={teamMemberDetail.websiteLink} className="text-white hover:underline">{teamMemberDetail.websiteLink}</a></p>
          </div>
        ) : (
          fallbackData
        )}
        <button
          onClick={downloadVCard}
          className="text-white border border-white py-2 px-4 flex items-center space-x-2"
        >
          <MdOutlineContactPhone className="text-white" />
          <span>Add to Contact</span>
        </button>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-0 mt-6 lg:mt-0">
        <MemberImageSlider teamMemberId={teamMemberId} />
      </div>

      <div className="absolute inset-x-0 bottom-0 w-full rotate-180 overflow-hidden">
        <svg className="w-full h-8 md:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </div>

  );
}

export default HeroSection;
