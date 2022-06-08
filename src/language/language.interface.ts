export interface iLanguge {
    [key: string]: iLanguageData;
}
export interface iLanguageData {
    name: string;
    code: string;
}
export interface iLangugeBody {
    name: string;
    code: string;
    dir: "ltr" | "rtl" | any;
    buttons: {
        yes: string;
        no: string;
        cancel: string;
        save: string;
        ok: string;
        open: string;
        update: string;
        delete: string,
        login: string;
        goToDashboard: string;
        join: string;
        check: string;
        selectImage: string;
        selectVideo: string;
        selectYoutube: string;
        logOut: string;
        enrollToCourse: string;
        addFile: string;
        nextLesson: string;
        add: string;
    },
    signIn: {
        welcomeBack: string;
    },
    form: {
        email: string;
        password: string;
        name: string;
        docx: string;
        path: string;
        description: string;
        phone: string;
        address: string;
        code: string;
        url: string;
        type: string;
        title: string;
        keywords: string;
        auther: string;
        items: string;
        trueItems: string;
    }
    dashboard: {
        dashboard: string;
        website: string;
        shortcut: string;
        users: string;
        fileExplorer: string;
        chat: string;
        sessions: string;
        language: string;
        account: string;
        setting: string;
        about: string;
        help: string;
        courses: string;
        textEditor: string;
        editedQuestions: string;
        editedTabs: string;
        websiteSetting: string;
        commingSoon: string;
        joinPage: string;
        tags: string;
        backupSystem: string;
        backupDatabase: string;
        backup: string;
    },
    text: {
        updateRow: string;
        addNew: string;
        areSure: string;
        areSureDelete: string;
        course: string;
        page: string;
        folder: string;
        rename: string;
        areSureLogOut: string;
        enterVideoUrl: string;
        hello: string;
        item: string;
    },
    error: {
        [key: string]: string
    }
}