import test from '@interactjs/_dev/test/test';
import interactions from '@interactjs/core/interactions';
import * as helpers from '@interactjs/core/tests/_helpers';
import PromisePolyfill from 'promise-polyfill';
import reflow from './';
test('reflow', (t) => {
    const scope = helpers.mockScope();
    interactions.install(scope);
    Object.assign(scope.actions, { TEST: {}, names: ['TEST'] });
    reflow.install(scope);
    t.ok(scope.Interactable.prototype.reflow instanceof Function, 'reflow method is added to Interactable.prototype');
    const fired = [];
    const interactable = scope.interactables.new(scope.window);
    const rect = Object.freeze({ top: 100, left: 200, bottom: 300, right: 400 });
    interactable.fire = ((iEvent) => { fired.push(iEvent); });
    interactable.target = {};
    interactable.options.TEST = { enabled: true };
    interactable.rectChecker(() => ({ ...rect }));
    // modify move coords
    scope.interactions.signals.on('before-action-move', ({ interaction }) => {
        interaction.coords.cur.page = {
            x: rect.left + 100,
            y: rect.top - 50,
        };
    });
    interactable.reflow({ name: 'TEST' });
    const phases = ['reflow', 'start', 'move', 'end'];
    for (const index in phases) {
        const phase = phases[index];
        t.equal(fired[index].type, `TEST${phase}`, `event #${index} is ${phase}`);
    }
    const interaction = fired[0].interaction;
    t.deepEqual(interaction.coords.start.page, {
        x: rect.left,
        y: rect.top,
    }, 'uses element top left for event coords');
    const reflowMove = fired[2];
    t.deepEqual(reflowMove.delta, { x: 100, y: -50 }, 'move delta is correct with modified interaction coords');
    t.notOk(interaction.pointerIsDown, 'reflow pointer was lifted');
    t.equal(interaction.pointers.length, 0, 'reflow pointer was removed from interaction');
    t.notOk(scope.interactions.list.includes(interaction), 'interaction is removed from list');
    t.end();
});
test('async reflow', async (t) => {
    const scope = helpers.mockScope();
    interactions.install(scope);
    Object.assign(scope.actions, { TEST: {}, names: ['TEST'] });
    let reflowEvent;
    let promise;
    const interactable = scope.interactables.new(scope.window);
    const rect = Object.freeze({ top: 100, left: 200, bottom: 300, right: 400 });
    interactable.rectChecker(() => ({ ...rect }));
    interactable.fire = ((iEvent) => { reflowEvent = iEvent; });
    interactable.options.TEST = { enabled: true };
    reflow.install(scope);
    // test with Promise implementation
    scope.window.Promise = PromisePolyfill;
    promise = interactable.reflow({ name: 'TEST' });
    t.ok(promise instanceof scope.window.Promise, 'method returns a Promise if available');
    t.notOk(reflowEvent.interaction.interacting(), 'reflow may end synchronously');
    t.equal(await promise, interactable, 'returned Promise resolves to interactable');
    let stoppedFromTimeout;
    // block the end of the reflow interaction and stop it after a timeout
    scope.interactions.signals.on('before-action-end', ({ interaction }) => {
        setTimeout(() => { interaction.stop(); stoppedFromTimeout = true; }, 0);
        return false;
    });
    stoppedFromTimeout = false;
    promise = interactable.reflow({ name: 'TEST' });
    t.ok(reflowEvent.interaction.interacting() && !stoppedFromTimeout, 'interaction continues if end is blocked');
    await promise;
    t.notOk(reflowEvent.interaction.interacting() && stoppedFromTimeout, 'interaction is stopped after promise is resolved');
    // test without Promise implementation
    stoppedFromTimeout = false;
    scope.window.Promise = undefined;
    promise = interactable.reflow({ name: 'TEST' });
    t.equal(promise, null, 'method returns null if no Proise is avilable');
    t.ok(reflowEvent.interaction.interacting() && !stoppedFromTimeout, 'interaction continues if end is blocked without Promise');
    setTimeout(() => {
        t.notOk(reflowEvent.interaction.interacting() || !stoppedFromTimeout, 'interaction is stopped after timeout without Promised');
    }, 0);
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbG93LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWZsb3cuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSw0QkFBNEIsQ0FBQTtBQUM3QyxPQUFPLFlBQVksTUFBTSwrQkFBK0IsQ0FBQTtBQUN4RCxPQUFPLEtBQUssT0FBTyxNQUFNLGlDQUFpQyxDQUFBO0FBQzFELE9BQU8sZUFBZSxNQUFNLGtCQUFrQixDQUFBO0FBQzlDLE9BQU8sTUFBTSxNQUFNLElBQUksQ0FBQTtBQUV2QixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDbkIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBRWpDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFM0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFM0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVyQixDQUFDLENBQUMsRUFBRSxDQUNGLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sWUFBWSxRQUFRLEVBQ3ZELGtEQUFrRCxDQUNuRCxDQUFBO0lBRUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUMxRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFFNUUsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFRLENBQUE7SUFDOUQsWUFBWSxDQUFDLE1BQWMsR0FBRyxFQUFFLENBQUE7SUFDakMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDN0MsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFFN0MscUJBQXFCO0lBQ3JCLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtRQUN0RSxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7WUFDNUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRztZQUNsQixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1NBQ2pCLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVGLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUVyQyxNQUFNLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBRWpELEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO1FBQzFCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxLQUFLLEVBQUUsRUFBRSxVQUFVLEtBQUssT0FBTyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0tBQzFFO0lBRUQsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtJQUV4QyxDQUFDLENBQUMsU0FBUyxDQUNULFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFDN0I7UUFDRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUk7UUFDWixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUc7S0FDWixFQUNELHdDQUF3QyxDQUN6QyxDQUFBO0lBRUQsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRTNCLENBQUMsQ0FBQyxTQUFTLENBQ1QsVUFBVSxDQUFDLEtBQUssRUFDaEIsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUNsQix3REFBd0QsQ0FDekQsQ0FBQTtJQUVELENBQUMsQ0FBQyxLQUFLLENBQ0wsV0FBVyxDQUFDLGFBQWEsRUFDekIsMkJBQTJCLENBQzVCLENBQUE7SUFFRCxDQUFDLENBQUMsS0FBSyxDQUNMLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUMzQixDQUFDLEVBQ0QsNkNBQTZDLENBQzlDLENBQUE7SUFFRCxDQUFDLENBQUMsS0FBSyxDQUNMLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFDN0Msa0NBQWtDLENBQ25DLENBQUE7SUFFRCxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVCxDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQy9CLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUVqQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTNCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRTNELElBQUksV0FBVyxDQUFBO0lBQ2YsSUFBSSxPQUFPLENBQUE7SUFFWCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDMUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQzVFLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzdDLFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQSxDQUFDLENBQUMsQ0FBUSxDQUFBO0lBQ2pFLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFBO0lBRTdDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFckIsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQTtJQUV0QyxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBQy9DLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLHVDQUF1QyxDQUFDLENBQUE7SUFDdEYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFFLDhCQUE4QixDQUFDLENBQUE7SUFFOUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLE9BQU8sRUFBRSxZQUFZLEVBQUUsMkNBQTJDLENBQUMsQ0FBQTtJQUVqRixJQUFJLGtCQUFrQixDQUFBO0lBQ3RCLHNFQUFzRTtJQUN0RSxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUU7UUFDckUsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN0RSxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUMsQ0FBQyxDQUFBO0lBRUYsa0JBQWtCLEdBQUcsS0FBSyxDQUFBO0lBQzFCLE9BQU8sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFFL0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUseUNBQXlDLENBQUMsQ0FBQTtJQUM3RyxNQUFNLE9BQU8sQ0FBQTtJQUNiLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxrQkFBa0IsRUFBRSxrREFBa0QsQ0FBQyxDQUFBO0lBRXhILHNDQUFzQztJQUN0QyxrQkFBa0IsR0FBRyxLQUFLLENBQUE7SUFDMUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBO0lBRWhDLE9BQU8sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDL0MsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLDhDQUE4QyxDQUFDLENBQUE7SUFDdEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUseURBQXlELENBQUMsQ0FBQTtJQUU3SCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsdURBQXVELENBQUMsQ0FBQTtJQUNoSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFFTCxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ0BpbnRlcmFjdGpzL19kZXYvdGVzdC90ZXN0J1xuaW1wb3J0IGludGVyYWN0aW9ucyBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL2ludGVyYWN0aW9ucydcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnQGludGVyYWN0anMvY29yZS90ZXN0cy9faGVscGVycydcbmltcG9ydCBQcm9taXNlUG9seWZpbGwgZnJvbSAncHJvbWlzZS1wb2x5ZmlsbCdcbmltcG9ydCByZWZsb3cgZnJvbSAnLi8nXG5cbnRlc3QoJ3JlZmxvdycsICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlID0gaGVscGVycy5tb2NrU2NvcGUoKVxuXG4gIGludGVyYWN0aW9ucy5pbnN0YWxsKHNjb3BlKVxuXG4gIE9iamVjdC5hc3NpZ24oc2NvcGUuYWN0aW9ucywgeyBURVNUOiB7fSwgbmFtZXM6IFsnVEVTVCddIH0pXG5cbiAgcmVmbG93Lmluc3RhbGwoc2NvcGUpXG5cbiAgdC5vayhcbiAgICBzY29wZS5JbnRlcmFjdGFibGUucHJvdG90eXBlLnJlZmxvdyBpbnN0YW5jZW9mIEZ1bmN0aW9uLFxuICAgICdyZWZsb3cgbWV0aG9kIGlzIGFkZGVkIHRvIEludGVyYWN0YWJsZS5wcm90b3R5cGUnXG4gIClcblxuICBjb25zdCBmaXJlZCA9IFtdXG4gIGNvbnN0IGludGVyYWN0YWJsZSA9IHNjb3BlLmludGVyYWN0YWJsZXMubmV3KHNjb3BlLndpbmRvdylcbiAgY29uc3QgcmVjdCA9IE9iamVjdC5mcmVlemUoeyB0b3A6IDEwMCwgbGVmdDogMjAwLCBib3R0b206IDMwMCwgcmlnaHQ6IDQwMCB9KVxuXG4gIGludGVyYWN0YWJsZS5maXJlID0gKChpRXZlbnQpID0+IHsgZmlyZWQucHVzaChpRXZlbnQpIH0pIGFzIGFueVxuICAoaW50ZXJhY3RhYmxlLnRhcmdldCBhcyBhbnkpID0ge31cbiAgaW50ZXJhY3RhYmxlLm9wdGlvbnMuVEVTVCA9IHsgZW5hYmxlZDogdHJ1ZSB9XG4gIGludGVyYWN0YWJsZS5yZWN0Q2hlY2tlcigoKSA9PiAoeyAuLi5yZWN0IH0pKVxuXG4gIC8vIG1vZGlmeSBtb3ZlIGNvb3Jkc1xuICBzY29wZS5pbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYmVmb3JlLWFjdGlvbi1tb3ZlJywgKHsgaW50ZXJhY3Rpb24gfSkgPT4ge1xuICAgIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIucGFnZSA9IHtcbiAgICAgIHg6IHJlY3QubGVmdCArIDEwMCxcbiAgICAgIHk6IHJlY3QudG9wIC0gNTAsXG4gICAgfVxuICB9KVxuXG4gIGludGVyYWN0YWJsZS5yZWZsb3coeyBuYW1lOiAnVEVTVCcgfSlcblxuICBjb25zdCBwaGFzZXMgPSBbJ3JlZmxvdycsICdzdGFydCcsICdtb3ZlJywgJ2VuZCddXG5cbiAgZm9yIChjb25zdCBpbmRleCBpbiBwaGFzZXMpIHtcbiAgICBjb25zdCBwaGFzZSA9IHBoYXNlc1tpbmRleF1cbiAgICB0LmVxdWFsKGZpcmVkW2luZGV4XS50eXBlLCBgVEVTVCR7cGhhc2V9YCwgYGV2ZW50ICMke2luZGV4fSBpcyAke3BoYXNlfWApXG4gIH1cblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGZpcmVkWzBdLmludGVyYWN0aW9uXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LnBhZ2UsXG4gICAge1xuICAgICAgeDogcmVjdC5sZWZ0LFxuICAgICAgeTogcmVjdC50b3AsXG4gICAgfSxcbiAgICAndXNlcyBlbGVtZW50IHRvcCBsZWZ0IGZvciBldmVudCBjb29yZHMnXG4gIClcblxuICBjb25zdCByZWZsb3dNb3ZlID0gZmlyZWRbMl1cblxuICB0LmRlZXBFcXVhbChcbiAgICByZWZsb3dNb3ZlLmRlbHRhLFxuICAgIHsgeDogMTAwLCB5OiAtNTAgfSxcbiAgICAnbW92ZSBkZWx0YSBpcyBjb3JyZWN0IHdpdGggbW9kaWZpZWQgaW50ZXJhY3Rpb24gY29vcmRzJ1xuICApXG5cbiAgdC5ub3RPayhcbiAgICBpbnRlcmFjdGlvbi5wb2ludGVySXNEb3duLFxuICAgICdyZWZsb3cgcG9pbnRlciB3YXMgbGlmdGVkJ1xuICApXG5cbiAgdC5lcXVhbChcbiAgICBpbnRlcmFjdGlvbi5wb2ludGVycy5sZW5ndGgsXG4gICAgMCxcbiAgICAncmVmbG93IHBvaW50ZXIgd2FzIHJlbW92ZWQgZnJvbSBpbnRlcmFjdGlvbidcbiAgKVxuXG4gIHQubm90T2soXG4gICAgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QuaW5jbHVkZXMoaW50ZXJhY3Rpb24pLFxuICAgICdpbnRlcmFjdGlvbiBpcyByZW1vdmVkIGZyb20gbGlzdCdcbiAgKVxuXG4gIHQuZW5kKClcbn0pXG5cbnRlc3QoJ2FzeW5jIHJlZmxvdycsIGFzeW5jICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlID0gaGVscGVycy5tb2NrU2NvcGUoKVxuXG4gIGludGVyYWN0aW9ucy5pbnN0YWxsKHNjb3BlKVxuXG4gIE9iamVjdC5hc3NpZ24oc2NvcGUuYWN0aW9ucywgeyBURVNUOiB7fSwgbmFtZXM6IFsnVEVTVCddIH0pXG5cbiAgbGV0IHJlZmxvd0V2ZW50XG4gIGxldCBwcm9taXNlXG5cbiAgY29uc3QgaW50ZXJhY3RhYmxlID0gc2NvcGUuaW50ZXJhY3RhYmxlcy5uZXcoc2NvcGUud2luZG93KVxuICBjb25zdCByZWN0ID0gT2JqZWN0LmZyZWV6ZSh7IHRvcDogMTAwLCBsZWZ0OiAyMDAsIGJvdHRvbTogMzAwLCByaWdodDogNDAwIH0pXG4gIGludGVyYWN0YWJsZS5yZWN0Q2hlY2tlcigoKSA9PiAoeyAuLi5yZWN0IH0pKVxuICBpbnRlcmFjdGFibGUuZmlyZSA9ICgoaUV2ZW50KSA9PiB7IHJlZmxvd0V2ZW50ID0gaUV2ZW50IH0pIGFzIGFueVxuICBpbnRlcmFjdGFibGUub3B0aW9ucy5URVNUID0geyBlbmFibGVkOiB0cnVlIH1cblxuICByZWZsb3cuaW5zdGFsbChzY29wZSlcblxuICAvLyB0ZXN0IHdpdGggUHJvbWlzZSBpbXBsZW1lbnRhdGlvblxuICBzY29wZS53aW5kb3cuUHJvbWlzZSA9IFByb21pc2VQb2x5ZmlsbFxuXG4gIHByb21pc2UgPSBpbnRlcmFjdGFibGUucmVmbG93KHsgbmFtZTogJ1RFU1QnIH0pXG4gIHQub2socHJvbWlzZSBpbnN0YW5jZW9mIHNjb3BlLndpbmRvdy5Qcm9taXNlLCAnbWV0aG9kIHJldHVybnMgYSBQcm9taXNlIGlmIGF2YWlsYWJsZScpXG4gIHQubm90T2socmVmbG93RXZlbnQuaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSwgJ3JlZmxvdyBtYXkgZW5kIHN5bmNocm9ub3VzbHknKVxuXG4gIHQuZXF1YWwoYXdhaXQgcHJvbWlzZSwgaW50ZXJhY3RhYmxlLCAncmV0dXJuZWQgUHJvbWlzZSByZXNvbHZlcyB0byBpbnRlcmFjdGFibGUnKVxuXG4gIGxldCBzdG9wcGVkRnJvbVRpbWVvdXRcbiAgLy8gYmxvY2sgdGhlIGVuZCBvZiB0aGUgcmVmbG93IGludGVyYWN0aW9uIGFuZCBzdG9wIGl0IGFmdGVyIGEgdGltZW91dFxuICBzY29wZS5pbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYmVmb3JlLWFjdGlvbi1lbmQnLCAoeyBpbnRlcmFjdGlvbiB9KSA9PiB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7IGludGVyYWN0aW9uLnN0b3AoKTsgc3RvcHBlZEZyb21UaW1lb3V0ID0gdHJ1ZSB9LCAwKVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxuXG4gIHN0b3BwZWRGcm9tVGltZW91dCA9IGZhbHNlXG4gIHByb21pc2UgPSBpbnRlcmFjdGFibGUucmVmbG93KHsgbmFtZTogJ1RFU1QnIH0pXG5cbiAgdC5vayhyZWZsb3dFdmVudC5pbnRlcmFjdGlvbi5pbnRlcmFjdGluZygpICYmICFzdG9wcGVkRnJvbVRpbWVvdXQsICdpbnRlcmFjdGlvbiBjb250aW51ZXMgaWYgZW5kIGlzIGJsb2NrZWQnKVxuICBhd2FpdCBwcm9taXNlXG4gIHQubm90T2socmVmbG93RXZlbnQuaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSAmJiBzdG9wcGVkRnJvbVRpbWVvdXQsICdpbnRlcmFjdGlvbiBpcyBzdG9wcGVkIGFmdGVyIHByb21pc2UgaXMgcmVzb2x2ZWQnKVxuXG4gIC8vIHRlc3Qgd2l0aG91dCBQcm9taXNlIGltcGxlbWVudGF0aW9uXG4gIHN0b3BwZWRGcm9tVGltZW91dCA9IGZhbHNlXG4gIHNjb3BlLndpbmRvdy5Qcm9taXNlID0gdW5kZWZpbmVkXG5cbiAgcHJvbWlzZSA9IGludGVyYWN0YWJsZS5yZWZsb3coeyBuYW1lOiAnVEVTVCcgfSlcbiAgdC5lcXVhbChwcm9taXNlLCBudWxsLCAnbWV0aG9kIHJldHVybnMgbnVsbCBpZiBubyBQcm9pc2UgaXMgYXZpbGFibGUnKVxuICB0Lm9rKHJlZmxvd0V2ZW50LmludGVyYWN0aW9uLmludGVyYWN0aW5nKCkgJiYgIXN0b3BwZWRGcm9tVGltZW91dCwgJ2ludGVyYWN0aW9uIGNvbnRpbnVlcyBpZiBlbmQgaXMgYmxvY2tlZCB3aXRob3V0IFByb21pc2UnKVxuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHQubm90T2socmVmbG93RXZlbnQuaW50ZXJhY3Rpb24uaW50ZXJhY3RpbmcoKSB8fCAhc3RvcHBlZEZyb21UaW1lb3V0LCAnaW50ZXJhY3Rpb24gaXMgc3RvcHBlZCBhZnRlciB0aW1lb3V0IHdpdGhvdXQgUHJvbWlzZWQnKVxuICB9LCAwKVxuXG4gIHQuZW5kKClcbn0pXG4iXX0=