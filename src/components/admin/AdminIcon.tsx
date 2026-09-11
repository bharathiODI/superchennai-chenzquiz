import AccodomationBanner from '../../assets/images/super-chennai-logo.png'
import Image from 'next/image'

export default function AdminIcon() {
  return <Image src={AccodomationBanner} alt="arattai" fill className="object-cover" priority />
}
