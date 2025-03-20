## Setup

Install dependencies and start up dev server

```
   npm install
   npm run dev
```

## Libraries

- react-pdf: for viewing the pdf document uploaded
- react-signature-canvas: for drawing signature on the pdf
- pdf-lib: for adding annotations and signature and exporting pdf
- lucide-react: icons used in project
- shadcn: for ui components and providing user feedbacks like toast
- react-colorful: color picker for the annotation tools

## Challenges

1. Viewing the uploaded pdf: Firstly i used iframes to display the pdf, but i was unable to select text for annotation, I researched and used react-pdf for that

2. Getting user signature on the exact location they want to sign when the user selects the 'sign' tool in the toolbar. This was simple done by tracking the mouse movement in reference to the pdf display viewport.

3. Getting the annotation to display on the position the user highlighted in the new exported pdf

# Suggested Features

- use pdf thumbnail with filename to display uploaded document before opening it
- add touch support for mobile phones
- add clear button to clear all annotation
- accurately position signature pad and position the signature at the exact position when file is exported
- change cursor type based on annotation tool selected
- make the annotation data persistent
- have a more user friendly comment prompt
- Fully develop the book reference section that displays the list of annotation
