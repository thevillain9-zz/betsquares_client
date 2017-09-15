import { Pipe, PipeTransform } from '@angular/core';

import { IGridBox } from '../models/igrid-box';
import { IUser } from '../models/iuser';

@Pipe({
    name: 'boxUserFilter',
    pure: false
})
export class BoxUserPipe implements PipeTransform {
    transform(items: IGridBox[], filter: BoxUserFilter): any {
        if (!items || !filter) {
            return items;
        }

        if (filter.winningFlag === 2) {
            return items.filter(item => item.userId.userId === filter.currentUser.userId && item.isTempWinner);
        } else if (filter.winningFlag === 1) {
            return items.filter(item => item.userId.userId === filter.currentUser.userId && item.isWinner);
        } else {
            return items.filter(item => item.userId.userId === filter.currentUser.userId);
        }
    }
}

export class BoxUserFilter {
    public currentUser: IUser;
    public winningFlag: Number;

    public constructor(init?: Partial<BoxUserFilter>) {
        Object.assign(this, init);
    }
}
