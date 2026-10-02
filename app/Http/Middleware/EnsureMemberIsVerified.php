<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMemberIsVerified
{
    /**
     * Handle an incoming request.
     * Ensure new/unverified members cannot access dashboard pages until verified by admin.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is a member and has not been verified/activated by admin
        if ($user && $user->role === 'member' && !$user->is_active) {
            // Allow logout and the membership pending page
            if ($request->routeIs('membership.pending') || $request->routeIs('logout')) {
                return $next($request);
            }

            return redirect()->route('membership.pending');
        }

        return $next($request);
    }
}
