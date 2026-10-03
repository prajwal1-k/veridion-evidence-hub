<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Veridion AI architecture
- UI reads data only through interfaces in src/services/index.ts (mock impls today) so a real API can be swapped in without touching pages.
- Shared domain types live in src/types; reusable presentational pieces (PageHeader, Panel, badges, empty/error/loading states) in src/components/common.
- App shell (sidebar + header) is rendered in src/routes/__root.tsx; nav items defined once in src/lib/nav.ts.
