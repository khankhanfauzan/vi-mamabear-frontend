import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
} from "@/components/icons/SocialIcons";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="relative bg-secondary pt-16 text-[var(--mama-brown)] bg-cover bg-[left_-6rem_bottom_0rem] min-[768px]:bg-left-bottom min-[1024px]:bg-center min-[1440px]:bg-[center_bottom_-4rem] bg-no-repeat md:mb-0"
      style={{
        backgroundImage: "url('/images/layout/footer.webp')",
      }}
    >
      
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        <div className="flex justify-between mb-24 font-semibold text-wrap">
          <section className="space-y-4 w-[8rem] min-[375px]:w-fit">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
              <p className="text-sm">Surabaya, Indonesia</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm">+62 888-869-5757</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm break-all">hi@MamaBear.co.id</p>
            </div>

            <div className="flex gap-1 md:gap-2 pt-2 text-[var(--mama-brown)]">
              <Link
                href="https://www.tiktok.com/@mamabear.official"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 p-0 hover:text-primary transition-all"
              >
                <TikTokIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://instagram.com/mamabearid"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 p-0 hover:text-primary transition-all"
              >
                <InstagramIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.facebook.com/mamabearcoid/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 p-0 hover:text-primary transition-all"
              >
                <FacebookIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.youtube.com/@mamabearid/featured"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 p-0 hover:text-primary transition-all"
              >
                <YoutubeIcon className="w-6 h-6" />
              </Link>
            </div>
          </section>

          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-6 lg:gap-12 font-semibold">
            <section>
              <h4 className="font-bold mb-4">Tentang Kami</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    Cerita MamaBear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles"
                    className="hover:text-primary transition-colors"
                  >
                    Artikel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold mb-4">Kerja Sama</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/career"
                    className="hover:text-primary transition-colors"
                  >
                    Karir
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reseller"
                    className="hover:text-primary transition-colors"
                  >
                    Reseller
                  </Link>
                </li>
                <li>
                  <Link
                    href="/affiliate"
                    className="hover:text-primary transition-colors"
                  >
                    Affiliate
                  </Link>
                </li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="https://shopee.co.id/mamabearcoid"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Shopee
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.tokopedia.com/mamabearid"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Tokopedia
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.tiktok.com/@mamabear.official?_r=1&_t=zs-93bgdw45wq8"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Tiktok Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.lazada.co.id/mamabear"
                    target="_blank"
                    className="hover:text-primary transition-colors"
                  >
                    Lazada
                  </Link>
                </li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-primary transition-colors"
                  >
                    F.A.Q
                  </Link>
                </li>
                <li>
                  <Link
                    href="/consultation"
                    className="hover:text-primary transition-colors"
                  >
                    Konsultasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div className="text-center pt-8">
          © 2026 - MamaBear. All rights reserved
        </div>
      </div>
    </footer>
  )}