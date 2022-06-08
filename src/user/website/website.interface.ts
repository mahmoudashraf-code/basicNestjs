export interface iWebsite {
    name: {
        def: string;
        ref?: string;
    };
    icon: string;
    data: iWebsiteBlocks;
    tags?: {
        def: string;
        ref?: string;
    }[]
    metaTags: {
        description: string;
        keywords: string[];
        author: string;
    },
    commingSoon?: boolean
    enableJoin?: boolean
}

export interface iWebsiteBlocks {
    [key: string]: iWebsiteBlocksData
}

export interface iWebsiteBlocksData {
    name: {
        def: string;
        ref?: string;
    };
    src: {
        def: string;
        ref?: string;
    };
    description: {
        def: string;
        ref?: string;
    };
    id: string;
    docx: {
        def: string;
        ref?: string;
    };
    show: boolean;
    tags: {
        def: string;
        ref?: string;
    }[]
}
