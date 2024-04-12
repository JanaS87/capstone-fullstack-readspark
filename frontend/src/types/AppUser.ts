export type AppUser = {
    id: string;
    username: string;
    avatarUrl: string;
    favoriteBookIds: string[];
    readBookIds: string[];
    bookIds: string[];
}