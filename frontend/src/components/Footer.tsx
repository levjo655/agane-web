export default function Footer(){

  return (

    <footer className="
      py-10
      text-center
      text-sm
      bg-agane-bg
      border-t
      border-agane-border
    ">


      <p>
        © {new Date().getFullYear()} Ågane Knives
      </p>


      <p className="mt-2">
        Japanese natural stone sharpening
      </p>


    </footer>

  );

}