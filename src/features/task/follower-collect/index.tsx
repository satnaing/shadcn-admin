import { Header } from "@/components/layout/header";
import { ThemeSwitch } from "@/components/theme-switch";
import DataTableProvider from "@/components/data-table/data-table-context";
import { CollectFollowerTask } from "./data/schema";
import { Main } from "@/components/layout/main";
import { DataTable } from "@/components/data-table";
import { columns } from "./components/follower-collect-task-columns";
import { followerCollectService } from "@/services/follower-collect-service";
import { FollowerCollectPrimaryButtons } from "./components/follower-collect-task-primary-buttons";
import { FollowerCollectDialogs } from "./components/follower-collect-dialogs";

type DataTableDialogType = 'create'

/**
 * 粉丝采集任务列表页面
 */
export default function FollowerCollectPage() {
  return (
    <DataTableProvider<CollectFollowerTask, DataTableDialogType> >
      <Header fixed hideSpacer>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>粉丝采集</h2>
            <p className='text-muted-foreground'>
              管理粉丝采集任务。
            </p>
          </div>
          <FollowerCollectPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable<CollectFollowerTask> columns={columns} service={followerCollectService} /* Toolbar={DataTableToolbar} */ />
        </div>
      </Main>
      <FollowerCollectDialogs />
    </DataTableProvider>
  );
} 