import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Take control of your &nbsp;</span>
        <span className={title({ color: "violet" })}>budget&nbsp;</span>
        <br />
        <span className={title()}>
          Spendwise makes it effortless.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Organized, fast and modern  Interactive Dashboard.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={'https://github.com/masnoonJunaid/spendwise-ui'}
        >
          Documentation
        </Link>
       
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by Sign UP <Code color="primary">SpendWise</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
