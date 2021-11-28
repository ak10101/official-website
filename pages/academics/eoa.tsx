import React from "react";
import Container from "../../components/layout/Container";
import Content from "../../components/layout/Content";
import Page from "../../components/layout/Page";
import PdfCard from "../../components/custom/PdfCard";
import { PageTitle } from "../../components/layout/PageTitle";
import { NextPage } from "next";
import { FileType } from "../../server/db";
import { getOther } from "../../server/other";
import { getFile } from "../../server/files";

interface PageProps {
  description: string;
  files: string[];
  fileItems?: FileType[];
}


const CustomPage: NextPage<{ page: PageProps }> = ({ page }) => {
  return (
    <Page title="AICTE Extention of Approval">
      <Container>
        <Content>
          <Content.FullWidth>
            <PageTitle className="text-center">
              AICTE Extention of Approval
            </PageTitle>
            <p>
              “EoA” means Extension of Approval granted by AICTE for the conduct
              of Technical Programme(s)/ Course(s) to an Institution for that
              Academic Year. “Extended EoA” means Extension of Approval granted
              by AICTE for the conduct of Technical Programme(s)/ Course(s) to
              an Institution for more than one Academic Year. As defined in the
              AICTE act 1987, Technical Education means programs, of Education,
              Research, and training in Engineering and Technology,
              Architecture, Town Planning, Management, Pharmacy, and Applied
              Arts and Crafts, and such other programs or areas as the Central
              Government may in consultation with the Council, by notification
              in the official gazette declare.{" "}
            </p>
            <div className="my-5">
              <div className="flex p-5 border-blue-700 flex-warp rounder-lg">
                {page.fileItems?.map((eoa) => (
                  <PdfCard  {...eoa} key={eoa.key} />
                ))}
              </div>
            </div>
          </Content.FullWidth>
        </Content>
      </Container>
    </Page>
  );
}
export default CustomPage;


export async function getStaticProps() {
  const page = (await getOther("page-extention-of-approval")) as PageProps;
  const files = page.files.map(async (file) => {
    return (await getFile(file)) as FileType;
  });
  page.fileItems = await Promise.all(files);

  return {
    props: {
      page,
    },
    revalidate: 600000,
  };
}
