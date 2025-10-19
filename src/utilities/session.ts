"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "@types";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
  player_name: string;
  avatar: string;
  code: string;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(encodedKey);
};

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
};

export async function createSession(playerName: string, avatar: string) {
  let code = generateCode();

  const current = await getSession();
  if (current?.playerName === playerName) {
    code = current.code;
  }

  const session = await encrypt({ player_name: playerName, avatar, code });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    secure: true,
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days
    sameSite: "lax",
    path: "/",
  });

  return code;
};

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
};

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);
  if (!session?.player_name) { return null; }

  const user: User = {
    playerName: session.player_name || '',
    avatar: session.avatar || '',
    code: session.code || '',
  }

  return user;
});

const generateCode = () => {
  const numberOfChars = 36; //a-z,0-9
  const length = 4;
  const value = numberOfChars ** length;
  const part1 = (Math.random() * value) | 0;
  const part2 = (Math.random() * value) | 0;
  const code1 = ("0000" + part1.toString(numberOfChars)).slice(-length);
  const code2 = ("0000" + part2.toString(numberOfChars)).slice(-length);
  return code1 + code2;
};