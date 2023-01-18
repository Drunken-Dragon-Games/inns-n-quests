 import { AssetStoreDsl } from "../../../service-asset-management/assets/assets-dsl";
import { getLevelFromXp,
          calculateLevel,
         } from "../../adventurers/utils";

test('get level from experience', async () => {
    let level = getLevelFromXp(0);
    expect(level).toEqual(1);
    level = getLevelFromXp(110);
    expect(level).toEqual(2)
    level = getLevelFromXp(350);
    expect(level).toEqual(3);
    level = getLevelFromXp(740);
    expect(level).toEqual(4);
    level = getLevelFromXp(1300);
    expect(level).toEqual(5);
    level = getLevelFromXp(2051);
    expect(level).toEqual(6);
    level = getLevelFromXp(3011);
    expect(level).toEqual(7);
    level = getLevelFromXp(4201);
    expect(level).toEqual(8);
    level = getLevelFromXp(5641);
    expect(level).toEqual(9);
    level = getLevelFromXp(7351);
    expect(level).toEqual(10);
});

test('calculate level', async () => {
    const level = calculateLevel(2051);
    expect(level).toEqual(6);
})