import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export function ActiveLink({
  children,
  href
}: {
  children: string;
  href: string;
}) {
  const router = useRouter();
  const style = {
    textDecoration: router.asPath === href ? 'underline' : 'none'
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} style={style}>
      {children}
    </Link>
  );
}
