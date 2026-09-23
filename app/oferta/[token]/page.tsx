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
    <div className="relative min-h-screen">
      {/* Tło identyczne ze stroną główną */}
      <div className="fixed inset-0 z-[-1] bg-slate-50 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_80%_at_0%_50%,#000_30%,transparent_100%)] opacity-80 pointer-events-none" />
      </div>

      <main className="relative text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
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
    </div>
  );
}

