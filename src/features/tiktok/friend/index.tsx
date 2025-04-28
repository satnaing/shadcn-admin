import DataTableProvider from "@/components/data-table/data-table-context";
import { TiktokFriend } from "./schema";
import { Header } from "@/components/layout/header";
import { ThemeSwitch } from "@/components/theme-switch";
import { Main } from "@/components/layout/main";
import { DataTable } from "@/components/data-table";
import { columns } from "./components/columns";
import tiktokFriendService from "@/services/tiktok-friend-service";

type DataTableDialogType = false

/**
 * 好友列表
 */
export default function FriendListPage() {
    return (
        <DataTableProvider<TiktokFriend, DataTableDialogType> >
            <Header fixed hideSpacer>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                </div>
            </Header>
            <Main>
                <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>好友列表</h2>
                        <p className='text-muted-foreground'>
                            管理好友列表。
                        </p>
                    </div>
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <DataTable<TiktokFriend> columns={columns} service={tiktokFriendService} /* Toolbar={DataTableToolbar} */ />
                </div>
            </Main>
        </DataTableProvider>
    )
}
