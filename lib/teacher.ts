export const isTeacher = (orgId?: string | null) => {
  return orgId === process.env.NEXT_PUBLIC_TEACHER_ID;
}