import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { offers } from '@/data/offers';
import OfferHero from '@/components/offer/OfferHero';
import OfferVideo from '@/components/offer/OfferVideo';
import OfferDiagnosis from '@/components/offer/OfferDiagnosis';
import OfferPricing from '@/components/offer/OfferPricing';
import OfferTelemetryTracker from '@/components/offer/OfferTelemetryTracker';

interface OfferPageProps {
  params: Promise<{
    token: string;
  }>;
}

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const offer = offers[resolvedParams.token];

  if (!offer) {
    return {
      title: 'Oferta nie znaleziona',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Strategia cyfrowa - ${offer.companyName}`,
    description: `Poufny dokument ofertowy przygotowany dla firmy ${offer.companyName}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OfferPage({ params }: OfferPageProps) {
  const resolvedParams = await params;
  const offer = offers[resolvedParams.token];

  if (!offer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-zinc-200">
      {/* Niewidoczny tracker uwagi i otwarcia oferty (Traferto style) */}
      <OfferTelemetryTracker 
        slug={resolvedParams.token}
        companyName={offer.companyName}
        clientName={offer.clientName}
      />

      <OfferHero 
        clientName={offer.clientName} 
        companyName={offer.companyName} 
      />
      
      {offer.videoUrl && (
        <OfferVideo videoUrl={offer.videoUrl} />
      )}
      
      <OfferDiagnosis 
        painPoints={offer.painPoints} 
        competitorAnalysis={offer.competitorAnalysis}
        solutionSteps={offer.solutionSteps}
      />
      
      <OfferPricing 
        packages={offer.packages} 
        companyName={offer.companyName}
        slug={resolvedParams.token}
      />
    </main>
  );
}

