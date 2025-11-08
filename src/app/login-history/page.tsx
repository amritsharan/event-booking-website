'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyRound, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { LoginHistory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

function LoginHistoryRow({ historyItem }: { historyItem: LoginHistory }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {format(new Date(historyItem.timestamp), 'eeee, MMMM d, yyyy')}
      </TableCell>
      <TableCell>{format(new Date(historyItem.timestamp), 'h:mm:ss a')}</TableCell>
    </TableRow>
  );
}

export default function LoginHistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const loginHistoryQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/loginHistory`);
  }, [firestore, user]);

  const { data: loginHistory, isLoading: areHistoryItemsLoading } = useCollection<LoginHistory>(loginHistoryQuery);

  const sortedHistory = useMemo(() => {
    if (!loginHistory) return [];
    return [...loginHistory].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [loginHistory]);

  const isLoading = isUserLoading || areHistoryItemsLoading;

  return (
    <div className="container py-12 md:py-16">
       <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <KeyRound className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Login History</CardTitle>
            <CardDescription>Review recent sign-in activity on your account.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : !user ? (
                <div className="text-center text-muted-foreground py-10">
                    <p>Please log in to see your login history.</p>
                    <Button asChild className="mt-4">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedHistory.length > 0 ? (
                            sortedHistory.map(item => <LoginHistoryRow key={item.id} historyItem={item} />)
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                    No login history found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
