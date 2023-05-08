import HomeFooterSection from "@/components/Content/Home/FooterSection";
import TermsContent from '@/components/Content/Terms/TermsContent';
import NavSection from "@/components/Content/Home/HomeNav";


const TermsAndCondition : React.FC = () => {
    return (
      <div className="isolate bg-white">
        <NavSection />
        <TermsContent />
        <HomeFooterSection />
      </div>
    )
}
export default TermsAndCondition
