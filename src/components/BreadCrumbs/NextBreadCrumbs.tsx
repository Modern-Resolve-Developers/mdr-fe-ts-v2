import { 
    Breadcrumbs, Typography, Link
 } from '@mui/material'

 import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

 type CrumbProps = {
    text: string
    href: any
    last: boolean
 }

 const _defaultGetTextGenerator = (param: any, query: any) => null;
 const _defaultGetDefaultTextGenerator = (subpath: any, path: any) => path;

 const generatePathParts = (pathStr: string) => {
    const pathWithoutQuery = pathStr.split("?")[0];
    return pathWithoutQuery.split("/")
        .filter(v => v.length > 0);
 }

 export default function NextBreadcrumbs({
    getTextGenerator=_defaultGetTextGenerator,
    getDefaultTextGenerator=_defaultGetDefaultTextGenerator
 }) {
    const router = useRouter()

    const breadcrumbs = React.useMemo(function generateBreadcrumbs(){
        const asPathNestedRoutes = generatePathParts(router.asPath)
        const pathnameNestedRoutes = generatePathParts(router.pathname)

        const crumblist = asPathNestedRoutes.map((subpath: any, idx: any) => {
            const param = pathnameNestedRoutes[idx].replace("[", "").replace("]", "")

            const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/")
            return {
                href, textGenerator: getTextGenerator(param, router.query),
                text: getDefaultTextGenerator(subpath, href)
            }
        })
        return [{ href: "/", text: "Home"}, ...crumblist]
    }, [router.asPath, router.pathname, router.query, getTextGenerator, getDefaultTextGenerator])

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((crumb: any, idx: any) => (
               <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
            ))}
        </Breadcrumbs>
    )
 }

 function Crumb({ text: defaultText, textGenerator, href, last=false } : any) {
    const [text, setText] = useState(defaultText)

    useEffect(() => {
        if (!Boolean(textGenerator)) { return; }
        const finalText = textGenerator();
        setText(finalText);
      }, [textGenerator]);

      if(last){
        return <Typography color="text.primary">{text}</Typography>
      }
      return (
        <Link underline="hover" color="inherit" href={href}>
            {text}
        </Link>
      )
 }