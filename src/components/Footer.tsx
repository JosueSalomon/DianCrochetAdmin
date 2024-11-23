import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 font-koulen mt-auto w-full z-10">
      <div className="container mx-auto text-center">
        <p className="font-bold uppercase">Dian Crochet Tejiendo lo que pienso</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="https://www.facebook.com/profile.php?id=100092578132580" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} className="fa-lg" />
          </a>
          <a href="https://www.instagram.com/dian.crochett/" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} className="fa-lg" />
          </a>
          {/* <a href="https://ik.imagekit.io/bmrd9vb4r/Imagen%20de%20WhatsApp%202024-10-11%20a%20las%2022.57.00_fea87d59.jpg?updatedAt=1728876255755" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} className="fa-lg" />
          </a> */}
        </div>
        <p className="mt-4 text-sm">Dian Crochet 2024</p>
      </div>
    </footer>
  );
}
