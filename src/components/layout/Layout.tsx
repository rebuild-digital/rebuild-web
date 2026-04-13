import { JSX, ParentProps } from "solid-js";
import { Title, Meta, Link } from "@solidjs/meta";
import Header from "./Header";
import Footer from "./Footer";
import FormSidebar from "../interactive/FormSidebar";
import site from "~/data/site";

interface LayoutProps extends ParentProps {
  title?: string;
  description?: string;
  featuredImage?: string;
  isHomepage?: boolean;
}

export default function Layout(props: LayoutProps) {
  const pageTitle = () =>
    props.isHomepage
      ? site.title
      : `${props.title ?? site.title} | ${site.title}`;

  const description = () => props.description ?? site.description;
  const image = () => `${site.url}${props.featuredImage ?? site.defaultImage}`;

  return (
    <>
      <Title>{pageTitle()}</Title>
      <Meta name="description" content={description()} />
      <Meta property="og:title" content={props.title ?? site.title} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:image" content={image()} />
      <Meta property="og:type" content="website" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={props.title ?? site.title} />
      <Meta name="twitter:description" content={description()} />
      <Meta name="twitter:image" content={image()} />
      <Link rel="icon" type="image/x-icon" href="/favicon.ico" />

      {/* Pirsch analytics */}
      <script
        defer
        src="https://api.pirsch.io/pa.js"
        id="pianjs"
        data-code="7MINshjhivqQWUXqrMyKqKbUBcHP3LAB"
      />

      <Header />

      {props.isHomepage ? (
        <>{props.children}</>
      ) : (
        <main id="main-content" class="lg:max-w-[1400px] mx-auto px-md pt-48">
          {props.children}
        </main>
      )}

      <Footer />
      <FormSidebar />
    </>
  );
}
