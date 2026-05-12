import * as React from "react";
import Link from "next/link";

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="landingFooter">
      <div className="contain">
        <div className="footerGrid">
          <div className="footerBrand">
            <img src="/wordmarkBlackMini.png" alt="CommonPlace Logo" className="footerLogo" />
            <p>Gather honest opinions on everything you create. Join the community of hobbyists helping each other grow.</p>
          </div>
          
          <div className="footerLinks">
            {/* <div className="linkGroup">
              <h5>Platform</h5>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/interests">Explore Interests</Link></li>
                <li><Link href="/sign-up">Get Started</Link></li>
                <li><Link href="/sign-in">Sign In</Link></li>
              </ul>
            </div>
            
            <div className="linkGroup">
              <h5>Interests</h5>
              <ul>
                <li><Link href="/landing/arts">Art & Design</Link></li>
                <li><Link href="/landing/writing">Writing & Poetry</Link></li>
                <li><Link href="/landing/music">Music & Audio</Link></li>
                <li><Link href="/landing/sports">Sports & Fitness</Link></li>
              </ul>
            </div> */}
            
            <div className="linkGroup">
              <h5>Legal</h5>
              <ul>
                <li><Link href="/policies/terms">Terms of Service</Link></li>
                <li><Link href="/policies/privacy">Privacy Policy</Link></li>
                <li><Link href="/policies/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footerBottom">
          <p>&copy; {currentYear} CommonPlace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
