/* eslint-disable @next/next/no-img-element */
import AccodomationBanner from '../../assets/images/super-chennai-logo.png'
import Image from 'next/image'

export default function AdminLogo() {
  return <Image src={AccodomationBanner} alt="arattai" fill className="object-cover" priority />
}
