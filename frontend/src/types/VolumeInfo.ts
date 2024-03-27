import {IndustryIdentifier} from "./IndustryIdentifier.ts";
import {ImageLink} from "./ImageLink.ts";
import {SearchInfo} from "./SearchInfo.ts";

export type VolumeInfo = {
    title: string,
    authors: string[],
    publisher: string,
    industryIdentifiers: IndustryIdentifier[],
    categories: string[],
    imageLinks: ImageLink,
    searchInfo: SearchInfo
}