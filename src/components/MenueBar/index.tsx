/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import closeButton from '../../assets/images/close.svg'
import MenuBarCloseButton from '../../assets/images/menuBarCloseButton.png'
//########################### TYPES######################################
import { DrawerItem, MenuItem, Logo } from '@/models/headerDrawer'

export default function MenuBar({
  setMenuBar,
  menuItems,
  drawerMenuItems = [],
  logo,
}: {
  setMenuBar: Dispatch<SetStateAction<boolean>>
  menuItems: MenuItem[]
  drawerMenuItems?: DrawerItem[]
  logo?: Logo
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="menuBarFullContainer">
      <div className="menuBarFullFirstSection"></div>

      <div className="menuBarFullSecondSection">
        <div className="closeButtonMenubar">
          <div className="SuperCehnnaiLogoImages">
            {logo?.filename && (
              <img
                className="SuperCehnnaiLogoImages"
                src={`/media/${logo.filename}`}
                alt={logo.alt || 'Super Chennai Logo'}
              />
            )}
          </div>

          <img
            className="closeButtonMenuBarMobile cursor:pointer"
            onClick={() => setMenuBar(false)}
            src={closeButton.src}
            alt="Close"
          />
          <img
            className="closeButtonMenuBaDesktop cursor-pointer"
            onClick={() => setMenuBar(false)}
            src={MenuBarCloseButton.src}
            alt="Close"
          />
        </div>

        <div className="w-full max-w-md mx-auto menuBarMain">
          {menuItems.map((section, index) => (
            <div key={`${section.label}-${index}`}>
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center mobileNavLinks"
              >
                <span>{section.label}</span>
                <span className="text-2xl font-bold">{openIndex === index ? '−' : '+'}</span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden pl-4 pb-4 space-y-2 MenuBarTitleSection"
                  >
                    {section.content.map((item, i) => (
                      <a
                        key={i}
                        href={item.link}
                        className="block text-sm text-gray-700 hover:text-blue-500"
                      >
                        <div className="font-medium titleMenuBar">{item.title}</div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md mx-auto containerMenuBar">
          <ul className="w-full max-w-md mx-auto menuBarLinksContent">
            {drawerMenuItems.map((item, index) => (
              <li key={index}>
                <a href={item.link}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
