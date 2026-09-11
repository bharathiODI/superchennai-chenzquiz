import { Block } from "payload";

const HeroSlider: Block = {
  slug: "heroSliderBlock",
  labels: {
    singular: "Hero Slider",
    plural: "Hero Sliders",
  },
  admin: {
    group: "Homepage Sections",
  },
  fields: [
    {
      name: "slides",
      type: "array",
      required: true,
      label: "Slides",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        
        {
          name: "title",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
      ],
    },
  ],
};

export default HeroSlider;
